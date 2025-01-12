import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns';
import { SharedLink } from "@/components/SharedLink";
import { Footer } from '@/components/Footer';
import { getCurrentUser } from './actions';
import { getLinks } from '@/lib/actions/links';

export default async function Home() {
  const user = await getCurrentUser();
  const userId = user?.id || null;

  const { data, error } = await getLinks(userId);

  // order the results by total points
  const orderedData = data?.sort((a, b) => (b.upvotes[0]?.count - b.downvotes[0]?.count) - (a.upvotes[0]?.count - a.downvotes[0]?.count));

  return (
    <main className="bg-icterine dark:bg-cinder min-w-screen min-h-screen">
      {orderedData && orderedData.map((link) => {
        return (
        <SharedLink
          key={link.id}
          id={link.id}
          userId={user?.id || null}
          voteDirection={link.LinkUserVote?.[0]?.direction || null}
          numberOfComments={link.Comment[0]?.count}
          postedDate={format(link.createdAt, 'MMM d, yyyy')}
          points={link.upvotes[0]?.count - link.downvotes[0]?.count}
          submittedBy={{
            firstName: link.User.firstName,
            lastName: link.User.lastName,
            nickname: link.User.nickname,
          }}
          title={link.title}
          url={link.link}
        />
      )})}

      <div className="border-t-2 border-t-cinder py-8 pl-leftGutter text-black dark:border-t-icterine dark:text-icterine">
        <Footer />
      </div>
    </main>
  );
}
