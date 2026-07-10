// seed.ts
import mongoose from "mongoose";
import Event from "./src/models/Event"; // adjust path if needed
import Seat from "./src/models/Seat"; // adjust path if needed

async function seed() {
  await mongoose.connect(
    "mongodb://niranjan:8762607040@ac-yotnn9w-shard-00-00.qjfshq1.mongodb.net:27017,ac-yotnn9w-shard-00-01.qjfshq1.mongodb.net:27017,ac-yotnn9w-shard-00-02.qjfshq1.mongodb.net:27017/primeSeats?ssl=true&replicaSet=atlas-ytkdz5-shard-0&authSource=admin&appName=Cluster0",
  );
  console.log("Connected to MongoDB");

  // Clear existing data
  // await Event.deleteMany({});
  // await Seat.deleteMany({});

  const eventsData = [
    {
      title: "Arijit Singh Music Night",
      description:
        "Catching a live Arijit Singh music night is an incredible experience, blending soulful melodies with electrifying stage presence. While specific mega-stadium dates for his World Tour continue to be announced, you can regularly find local tribute nights and pop-up shows at venues across Bengaluru.",
      venue: "Bengaluru",
      dateTime: new Date("2026-08-15T19:00:00"),
      organizerId: "6a32b60104b73b75feb71042",
      category: "music",
      status: "upcoming",
      totalSeats: 10,
    },
    {
      title: "Sonu Nigam Live Concert",
      description:
        "Sonu Nigam is an Indian playback singer, music director, dubbing artist and actor. He is considered one of the most versatile singers in India, with a wide vocal range. His performances include a wide range of genres, like classical music, devotional music, ghazals, qawwali, rock and pop music, among others.",
      venue: "Mysore",
      dateTime: new Date("2026-08-18T10:00:00"),
      organizerId: "6a32b60104b73b75feb71042",
      category: "music",
      status: "upcoming",
      totalSeats: 15,
    },
    {
      title: "Stand-up Comedy Show by Kapil Sharma",
      description:
        "Kapil Sharma is an Indian stand-up comedian, television presenter, actor and producer. He is best known for hosting The Kapil Sharma Show, a popular comedy talk show in India.",
      venue: "Bengaluru",
      dateTime: new Date("2026-07-28T20:00:00"),
      organizerId: "6a32b60104b73b75feb71042",
      category: "comedy",
      status: "upcoming",
      totalSeats: 10,
    },
    {
      title: "Infy Food Festival",
      description:
        "A celebration of culinary delights, featuring local and international cuisines.",
      venue: "Infocity, Bengaluru",
      dateTime: new Date("2026-08-28T11:00:00"),
      organizerId: "6a32b60104b73b75feb71042",
      category: "food",
      status: "upcoming",
      totalSeats: 15,
    },
    {
      title: "Global Food Carnival",
      description:
        "A gastronomic journey around the world, offering a variety of international dishes and flavors.",
      venue: "Bengaluru",
      dateTime: new Date("2026-09-30T12:00:00"),
      organizerId: "6a32b60104b73b75feb71042",
      category: "food",
      status: "upcoming",
      totalSeats: 10,
    },
    {
      title: "Tech Innovators Meetup",
      description:
        "Join leading tech innovators to discuss the future of technology and innovation.",
      venue: "Tech Park, Bengaluru",
      dateTime: new Date("2026-09-05T18:00:00"),
      organizerId: "6a32b60104b73b75feb71042",
      category: "business",
      status: "upcoming",
      totalSeats: 8,
    },
  ];

  for (const ev of eventsData) {
    const event = new Event(ev);
    await event.save();

    // Generate seats for each event
    const seats = [];
    for (let i = 1; i <= ev.totalSeats; i++) {
      seats.push({
        eventId: event._id,
        section: "General",
        row: `R${Math.ceil(i / 10)}`, // group seats in rows of 10
        number: `${i}`,
        status: "available",
      });
    }
    await Seat.insertMany(seats);
    console.log(`Seeded event "${ev.title}" with ${ev.totalSeats} seats`);
  }

  await mongoose.disconnect();
  console.log("Seeding complete, disconnected");
}

seed().catch((err) => {
  console.error(err);
  mongoose.disconnect();
});
