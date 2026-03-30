import prisma from "../lib/prisma.js";

export const createInquiry = async (req, res) => {
  const userId = req.userId;
  const { propertyId, message } = req.body;

  if (!propertyId || !message) {
    return res.status(400).json({ message: "propertyId and message are required" });
  }

  try {
    const inquiry = await prisma.inquiry.create({
      data: {
        userId,
        propertyId,
        message,
      },
    });

    await prisma.listingAnalytics.upsert({
      where: { propertyId },
      update: { inquiries: { increment: 1 } },
      create: { propertyId, inquiries: 1 },
    });

    res.status(201).json(inquiry);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create inquiry" });
  }
};

export const getUserInquiries = async (req, res) => {
  const userId = req.userId;

  try {
    const inquiries = await prisma.inquiry.findMany({
      where: { userId },
      include: {
        property: true,
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(inquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get inquiries" });
  }
};

export const getAgentInquiries = async (req, res) => {
  const userId = req.userId;

  try {
    const inquiries = await prisma.inquiry.findMany({
      where: {
        property: {
          userId,
        },
      },
      include: {
        property: true,
        user: {
          select: { id: true, username: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json(inquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get agent inquiries" });
  }
};

