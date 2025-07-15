import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Users, LogIn, UserPlus, Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import UsernameRequiredModal from './UsernameRequiredModal';
import { updateUserProfile } from '../api';

type LayoutProps = { children: React.ReactNode; noPaddingTop?: boolean };

const Layout: React.FC<LayoutProps> = ({ children, noPaddingTop }) => {
  const { user, logout, setUser } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [showUsernameModal, setShowUsernameModal] = React.useState(false);

  React.useEffect(() => {
    if (user && (!user.socialLinks || (!user.socialLinks.tiktok && !user.socialLinks.instagram))) {
      setShowUsernameModal(true);
    } else {
      setShowUsernameModal(false);
    }
  }, [user]);

  const handleSaveUsername = async (tiktok: string, instagram: string) => {
    if (!user || !user._id) return;
    const socialLinks = { tiktok, instagram };
    try {
      await updateUserProfile(user._id, { socialLinks });
      if (setUser) {
        setUser({ ...user, socialLinks });
        localStorage.setItem('user', JSON.stringify({ ...user, socialLinks }));
      }
      setShowUsernameModal(false);
    } catch {
      alert('Gagal menyimpan username. Coba lagi.');
    }
  };

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Anggota', href: '/members' },
    { name: 'Benefits', href: '/benefits' },
    { name: 'Courses', href: '/courses' },
  ];

  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen flex flex-col ${noPaddingTop ? '' : 'pt-16'}`}>
      <UsernameRequiredModal
        isOpen={showUsernameModal}
        onClose={() => {}}
        onSave={handleSaveUsername}
        initialTiktok={user?.socialLinks?.tiktok || ''}
        initialInstagram={user?.socialLinks?.instagram || ''}
      />
      <nav className="bg-white/80 backdrop-blur-sm shadow-lg fixed top-0 left-0 w-full z-[60]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-purple-600" />
                <span className="text-xl font-bold text-purple-600">
                  Creators Community
                </span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-purple-600 bg-purple-100'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Link
                      to="/dashboard"
                      className="text-gray-700 hover:text-purple-600 font-medium flex items-center space-x-2"
                    >
                      <span>{user.name}</span>
                      {user.isAdmin && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                          <Shield className="h-3 w-3 mr-1" />
                          Admin
                        </span>
                      )}
                    </Link>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-1 text-gray-700 hover:text-purple-600 font-medium"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <UserPlus className="h-4 w-4" />
                    <span>Register</span>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="text-gray-700 hover:text-purple-600"
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive(item.href)
                      ? 'text-purple-600 bg-purple-100'
                      : 'text-gray-700 hover:text-purple-600 hover:bg-purple-50'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="border-t pt-4">
                {user ? (
                  <>
                    <div className="px-3 py-2">
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-700 font-medium">{user.name}</span>
                        {user.isAdmin && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                            <Shield className="h-3 w-3 mr-1" />
                            Admin
                          </span>
                        )}
                      </div>
                    </div>
                    <Link
                      to="/dashboard"
                      className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:text-purple-600 font-medium"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="block px-3 py-2 text-gray-700 hover:text-purple-600 font-medium"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-1">
        {children}
      </main>

      <footer className="bg-gray-900 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2 flex flex-col justify-between">
              <div className="flex items-center space-x-2 mb-3">
                <Users className="h-8 w-8 text-purple-400" />
                <span className="text-2xl font-bold text-purple-400">Creators Community</span>
              </div>
              <p className="text-gray-400 mb-2 leading-relaxed">
                Komunitas creators mahasiswa ITS untuk saling support dan berkembang bersama.
              </p>
              <p className="text-sm text-gray-500">#1KontenLagi - Mari berkarya dan menginspirasi!</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/benefits" className="text-gray-400 hover:text-white transition-colors">Benefits</Link></li>
                <li><Link to="/courses" className="text-gray-400 hover:text-white transition-colors">Courses</Link></li>
                <li><Link to="/members" className="text-gray-400 hover:text-white transition-colors">Anggota</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-white transition-colors">Terms of Use</button></li>
                <li><button className="text-gray-400 hover:text-white transition-colors">Privacy Policy</button></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center">
            <p className="text-gray-500 text-sm">© 2024 ITS Creators Community. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;