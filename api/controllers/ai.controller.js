import prisma from "../lib/prisma.js";
import OpenAI from "openai";

const client = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

export const recommendProperties = async (req, res) => {
  if (!client) return res.status(503).json({ message: "AI not configured" });
  const userId = req.userId;

  try {
    const lastSaved = await prisma.savedPost.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { post: true },
    });

    const candidates = await prisma.post.findMany({
      where: { status: "ACTIVE" },
      take: 30,
    });

    const prompt = `
You are a real estate recommendation engine.

User last saved property (may be null):
${JSON.stringify(lastSaved?.post || null)}

Candidate properties:
${JSON.stringify(
  candidates.map((c) => ({
    id: c.id,
    title: c.title,
    city: c.city,
    price: c.price,
    bedroom: c.bedroom,
    bathroom: c.bathroom,
    type: c.type,
    property: c.property,
  }))
)}

Return a JSON array of up to 5 candidate IDs that best match the user's interests.
`;

    const completion = await client.responses.create({
      model: "gpt-4.1-mini",
      input: prompt,
    });

    const text = completion.output[0]?.content[0]?.text || "";
    let ids = [];
    try {
      ids = JSON.parse(text);
    } catch {
      ids = candidates.slice(0, 5).map((c) => c.id);
    }

    const recommendations = await prisma.post.findMany({
      where: { id: { in: ids } },
    });

    res.status(200).json(recommendations);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get recommendations" });
  }
};

