import Header from '../Components/Header';
import Footer from '../Components/footer';
import BlogList from '../Components/bloglist';

const BlogListPage = () => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
            <BlogList />
        </main>
        <Footer />
    </div>
);

export default BlogListPage;
