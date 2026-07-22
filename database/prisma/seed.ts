import { PrismaClient, Status } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data for idempotent re-runs
  await prisma.comment.deleteMany();
  await prisma.ticket.deleteMany();

  // Create 5 sample tickets
  const ticket1 = await prisma.ticket.create({
    data: {
      title: 'Login page returns 500 error after password reset',
      description:
        'After completing the password reset flow, attempting to log in with the new password results in a 500 Internal Server Error. Cleared cookies and tried in incognito — same result.',
      status: Status.OPEN,
    },
  });

  const ticket2 = await prisma.ticket.create({
    data: {
      title: 'Dashboard charts not loading on Safari',
      description:
        'The analytics dashboard charts render correctly on Chrome and Firefox but show a blank white area on Safari 17. No console errors visible.',
      status: Status.IN_PROGRESS,
    },
  });

  const ticket3 = await prisma.ticket.create({
    data: {
      title: 'Add CSV export to user management table',
      description:
        'We need the ability to export the full user list as a CSV file from the admin user management page. Should include name, email, role, and last login date.',
      status: Status.RESOLVED,
    },
  });

  const ticket4 = await prisma.ticket.create({
    data: {
      title: 'Email notifications arriving with 2-hour delay',
      description:
        'Transactional emails (password reset, order confirmation) are being delivered approximately 2 hours after the triggering event. Expected delivery is under 1 minute.',
      status: Status.CLOSED,
    },
  });

  await prisma.ticket.create({
    data: {
      title: 'Mobile navigation menu overlaps page content',
      description:
        'On screens narrower than 375px, the hamburger menu overlay does not cover the full viewport and the underlying page content remains interactive, causing accidental taps.',
      status: Status.OPEN,
    },
  });

  // Add comments to a couple of tickets
  await prisma.comment.createMany({
    data: [
      {
        ticketId: ticket1.id,
        message: 'Confirmed this is reproducible. Checking the auth service logs now.',
      },
      {
        ticketId: ticket1.id,
        message: 'Found the issue — the token refresh endpoint is rejecting the new password hash format.',
      },
      {
        ticketId: ticket2.id,
        message: 'Looks like a WebKit rendering bug with the chart library. Testing a polyfill.',
      },
    ],
  });

  console.log('Seed complete: 5 tickets and 3 comments created.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
