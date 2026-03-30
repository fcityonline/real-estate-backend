import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userIDs: { hasSome: [tokenUserId] } },
    });
    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    const message = await prisma.message.create({
      data: { text, chatId, userId: tokenUserId },
    });

    await prisma.chat.update({
      where: { id: chatId },
      data: {
        lastMessage: text,
        seenBy: { set: [tokenUserId] },
      },
    });

    res.status(200).json(message);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};

export const getMessages = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;

  try {
    const chat = await prisma.chat.findFirst({
      where: { id: chatId, userIDs: { hasSome: [tokenUserId] } },
    });
    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    const messages = await prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json(messages);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get messages!" });
  }
};