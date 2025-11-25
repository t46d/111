import MatchCard from '../MatchCard';

export default function MatchCardExample() {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      <MatchCard
        name="Ava"
        score={0.86}
        interests={['Design', 'Tech', 'Music']}
      />
      <MatchCard
        name="Leo"
        score={0.81}
        interests={['Music', 'Travel', 'Art']}
      />
      <MatchCard
        name="Maya"
        score={0.79}
        interests={['Art', 'Wellness', 'Books']}
      />
    </div>
  );
}
