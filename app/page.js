import Link from "next/link";

function HomePage() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <h1 className="text-6xl font-bold text-primary">GPTTours</h1>
          <p className="py-6 text-lg leading-loose">
            GPTTours: Your AI language companion. Powered by OpenAI, it enhances
            your conversation, content creation, and more!
          </p>
          <Link href="/chat" className="btn btn-secondary">
            GET STARTED
          </Link>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
