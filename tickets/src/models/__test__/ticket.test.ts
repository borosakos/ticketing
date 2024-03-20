import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () =>{
  // Create an instance of a ticket
  const ticket = Ticket.build({
    title: "title",
    price: 200,
    userId: "12345"
  });
  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two separate changes to the tickets
  firstInstance!.set({ price: 100 });
  firstInstance!.set({ price: 300 });

  // Save the first fetched ticket
  await firstInstance!.save();

  // Save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error("Should not reach this point");
});

it("increments the version number on multiple saves", async() => {
  const ticket = Ticket.build({
    title: "title",
    price: 200,
    userId: "12345"
  });
  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});
