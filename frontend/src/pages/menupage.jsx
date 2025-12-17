import Header from '../Components/Header';
import Footer from '../Components/footer';
import MenuList from '../Components/menulist';

const Menu = () => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
            <MenuList />
        </main>
        <Footer />
    </div>
);

export default Menu;
