import { PrismaClient, Status, Priority } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (idempotent — safe to re-run)
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany();

  // ─── Create Users ──────────────────────────────────────────────────────────

  const alice = await prisma.user.create({
    data: { name: 'Alice Johnson', email: 'alice@example.com' },
  });

  const bob = await prisma.user.create({
    data: { name: 'Bob Smith', email: 'bob@example.com' },
  });

  const carol = await prisma.user.create({
    data: { name: 'Carol Williams', email: 'carol@example.com' },
  });

  // ─── Create Tickets ────────────────────────────────────────────────────────

  const ticket1 = await prisma.ticket.create({
    data: {
      title: 'Login page returns 500 error after password reset',
      description:
        'After completing the password reset flow, attempting to log in with the new password results in a 500 Internal Server Error. Cleared cookies and tried in incognito — same result.',
      status: Status.OPEN,
      priority: Priority.HIGH,
      createdById: alice.id,
      assignedToId: bob.id,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: 'Dashboard charts not loading on Safari',
      description:
        'The analytics dashboard charts render correctly on Chrome and Firefox but show a blank white area on Safari 17. No console errors visible.',
      status: Status.IN_PROGRESS,
      priority: Priority.MEDIUM,
      createdById: bob.id,
      assignedToId: carol.id,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      title: 'Add CSV export to user management table',
      description:
        'We need the ability to export the full user list as a CSV file from the admin user management page. Should include name, email, role, and last login date.',
      status: Status.RESOLVED,
      priority: Priority.LOW,
      createdById: carol.id,
      assignedToId: alice.id,
    },
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      title: 'Email notifications arriving with 2-hour delay',
      description:
        'Transactional emails (password reset, order confirmation) are being delivered approximately 2 hours after the triggering event. Expected delivery is under 1 minute.',
      status: Status.CLOSED,
      priority: Priority.HIGH,
      createdById: alice.id,
      assignedToId: bob.id,
    },
  });

  await prisma.ticket.create({
    data: {
      title: 'Mobile navigation menu overlaps page content',
      description:
        'On screens narrower than 375px, the hamburger menu overlay does not cover the full viewport and the underlying page content remains interactive, causing accidental taps.',
      status: Status.OPEN,
      priority: Priority.MEDIUM,
      createdById: bob.id,
      assignedToId: alice.id,
    },
  });

  // ─── Create Comments ───────────────────────────────────────────────────────

  await prisma.comment.createMany({
    data: [
      {
        ticketId: ticket1.id,
        message: 'Confirmed this is reproducible. Checking the auth service logs now.',
        createdById: bob.id,
      },
      {
        ticketId: ticket1.id,
        message: 'Found the issue — the token refresh endpoint is rejecting the new password hash format.',
        createdById: bob.id,
      },
      {
        ticketId: ticket2.id,
        message: 'Looks like a WebKit rendering bug with the chart library. Testing a polyfill.',
        createdById: carol.id,
      },
      {
        ticketId: ticket3.id,
        message: 'CSV export implemented and deployed. Please verify on staging.',
        createdById: alice.id,
      },
      {
        ticketId: ticket4.id,
        message: 'Root cause was a misconfigured queue worker. Fixed and emails are now instant.',
        createdById: bob.id,
      },
    ],
  });

  console.log('Seed complete: 3 users, 5 tickets, 5 comments created.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
