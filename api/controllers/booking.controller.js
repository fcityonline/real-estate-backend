import prisma from "../lib/prisma.js";

export const createBooking = async (req, res) => {
  const userId = req.userId;
  const { propertyId, scheduledAt, type } = req.body;

  if (!propertyId || !scheduledAt || !type) {
    return res.status(400).json({ message: "propertyId, scheduledAt and type are required" });
  }

  try {
    const booking = await prisma.booking.create({
      data: {
        userId,
        propertyId,
        scheduledAt: new Date(scheduledAt),
        type,
        status: "PENDING",
      },
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create booking" });
  }
};

export const getUserBookings = async (req, res) => {
  const userId = req.userId;

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: { property: true },
      orderBy: { scheduledAt: "asc" },
    });

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get bookings" });
  }
};

export const getAgentBookings = async (req, res) => {
  const userId = req.userId;

  try {
    const bookings = await prisma.booking.findMany({
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
      orderBy: { scheduledAt: "asc" },
    });

    res.status(200).json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to get agent bookings" });
  }
};

