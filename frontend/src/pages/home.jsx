import Header from '../Components/Header';
import Footer from '../Components/footer';
import HomePage from '../Components/homepage';

const Home = () => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
            <HomePage />
        </main>
        <Footer />
    </div>
);

export default Home;
