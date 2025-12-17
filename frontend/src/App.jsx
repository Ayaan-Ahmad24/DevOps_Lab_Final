// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import HomePage from "./Components/homepage";
import MenuPage from "./Components/menulist";
import BlogListPage from "./Components/bloglist";
import AddBlogPage from "./Components/addBlogPage";
import AddMenuItemPage from "./Components/addMenuitem";
import EditBlogPage from "./Components/EditBlog";
import EditMenuItemPage from "./Components/EditMenuItemPage";
import AdminLoginPage from "./Components/loginpage";
import ShowAllBlogsAdminPage from "./Components/showAllblogsadmin";
import ShowAllMenuItemsAdminPage from "./Components/showAllmenuAdmin";
import AdminDashboard from "./pages/adminDashboad";
import Header from "./Components/Header";
import Footer from "./Components/footer";
import ErrorBoundary from "./Components/Errorboundary";
import SingleBlogPage from "./Components/blogpage";
import SearchPage from "./pages/searchpage";
import PrivateRoute from "./Components/PrivateRoutes"; // Import PrivateRoute
import ContactUs from "./pages/ContactUs"
import PropTypes from "prop-types";

// Create a QueryClient instance
const queryClient = new QueryClient();

const PublicLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

PublicLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const AdminLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gray-50">
    <Header /> 
    <main className="flex-grow p-4">{children}</main>
    <Footer />
  </div>
);

AdminLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              <PublicLayout>
                <ErrorBoundary>
                  <HomePage />
                </ErrorBoundary>
              </PublicLayout>
            }
          />
          <Route
            path="/contact"
            element={
              <PublicLayout>
                <ErrorBoundary>
                  <ContactUs />
                </ErrorBoundary>
              </PublicLayout>
            }
          />
          <Route
            path="/menu"
            element={
              <PublicLayout>
                <ErrorBoundary>
                  <MenuPage />
                </ErrorBoundary>
              </PublicLayout>
            }
          />
          <Route
            path="/blogs"
            element={
              <PublicLayout>
                <ErrorBoundary>
                  <BlogListPage />
                </ErrorBoundary>
              </PublicLayout>
            }
          />
          <Route
            path="/blog/:id"
            element={
              <PublicLayout>
                <ErrorBoundary>
                  <SingleBlogPage />
                </ErrorBoundary>
              </PublicLayout>
            }
          />
          <Route
            path="/search"
            element={
              <PublicLayout>
                <ErrorBoundary>
                  <SearchPage />
                </ErrorBoundary>
              </PublicLayout>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/login"
            element={
              <AdminLayout>
                <AdminLoginPage />
              </AdminLayout>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute
                element={
                  <AdminLayout>
                    <ErrorBoundary>
                      <AdminDashboard />
                    </ErrorBoundary>
                  </AdminLayout>
                }
              />
            }
          />
          <Route
            path="/admin/add-blog"
            element={
              <PrivateRoute
                element={
                  <AdminLayout>
                    <ErrorBoundary>
                      <AddBlogPage />
                    </ErrorBoundary>
                  </AdminLayout>
                }
              />
            }
          />
          <Route
            path="/admin/add-menu-item"
            element={
              <PrivateRoute
                element={
                  <AdminLayout>
                    <ErrorBoundary>
                      <AddMenuItemPage />
                    </ErrorBoundary>
                  </AdminLayout>
                }
              />
            }
          />
          <Route
            path="/admin/edit-blog/:id"
            element={
              <PrivateRoute
                element={
                  <AdminLayout>
                    <ErrorBoundary>
                      <EditBlogPage />
                    </ErrorBoundary>
                  </AdminLayout>
                }
              />
            }
          />
          <Route
            path="/admin/edit-menu-item/:id"
            element={
              <PrivateRoute
                element={
                  <AdminLayout>
                    <ErrorBoundary>
                      <EditMenuItemPage />
                    </ErrorBoundary>
                  </AdminLayout>
                }
              />
            }
          />
          <Route
            path="/admin/show-all-blogs"
            element={
              <PrivateRoute
                element={
                  <AdminLayout>
                    <ErrorBoundary>
                      <ShowAllBlogsAdminPage />
                    </ErrorBoundary>
                  </AdminLayout>
                }
              />
            }
          />
          <Route
            path="/admin/show-all-menu-items"
            element={
              <PrivateRoute
                element={
                  <AdminLayout>
                    <ErrorBoundary>
                      <ShowAllMenuItemsAdminPage />
                    </ErrorBoundary>
                  </AdminLayout>
                }
              />
            }
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
