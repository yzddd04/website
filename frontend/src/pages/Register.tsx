import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TermsModal from '../components/TermsModal';
import PrivacyModal from '../components/PrivacyModal';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    department: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);

  const { registrationEnabled, register } = useAuth();
  const navigate = useNavigate();

  const departments = [
    'Teknik Informatika',
    'Sistem Informasi',
    'Teknik Komputer',
    'Teknik Elektro',
    'Teknik Biomedik',
    'Teknik Mesin',
    'Teknik Industri',
    'Teknik Material',
    'Teknik Kimia',
    'Teknik Fisika',
    'Teknik Sipil',
    'Arsitektur',
    'Perencanaan Wilayah dan Kota',
    'Teknik Lingkungan',
    'Teknik Geomatika',
    'Teknik Perkapalan',
    'Teknik Sistem Perkapalan',
    'Teknik Kelautan',
    'Desain Komunikasi Visual',
    'Desain Produk Industri',
    'Statistika',
    'Matematika',
    'Fisika',
    'Kimia',
    'Biologi',
    'Aktuaria'
  ];

  const validateEmail = (email: string) => {
    const itsEmailRegex = /^[0-9]{10}@student\.its\.ac\.id$/;
    return itsEmailRegex.test(email);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreedToTerms) {
      setError('Anda harus menyetujui Terms of Use dan Privacy Policy');
      return;
    }

    if (!validateEmail(formData.email)) {
      setError('Aplikasi ini khusus mahasiswa ITS. Gunakan email dengan format NRP@student.its.ac.id');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password dan konfirmasi password tidak cocok');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter');
      return;
    }

    setLoading(true);
    setError('');

    // Integrasi ke backend
    const result = await register(formData.email, formData.name, formData.department, formData.password);
      setLoading(false);
    if (result.success) {
      alert('Registrasi berhasil! Silakan login dengan akun Anda.');
      navigate('/login');
    } else {
      setError(result.message);
    }
  };

  if (!registrationEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-yellow-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Pendaftaran Ditutup
          </h2>
          <p className="mt-4 text-gray-600">
            Pendaftaran akan dibuka di UKM Expo ITS tahun depan. 
            Ikuti sosial media kami untuk mendapatkan update terbaru.
          </p>
          <div className="mt-6">
            <Link
              to="/"
              className="text-purple-600 hover:text-purple-500 font-medium"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
            <UserPlus className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Daftar Akun Baru
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-medium text-purple-600 hover:text-purple-500">
              Masuk sekarang
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Mahasiswa ITS *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="NRP@student.its.ac.id"
              />
              <p className="mt-1 text-xs text-gray-500">
                Format: 10 digit NRP diikuti @student.its.ac.id
              </p>
            </div>

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Lengkap *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={formData.name}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                placeholder="Nama lengkap Anda"
              />
            </div>

            <div>
              <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                Departemen *
              </label>
              <select
                id="department"
                name="department"
                required
                value={formData.department}
                onChange={handleInputChange}
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                <option value="">Pilih Departemen</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Minimal 6 karakter"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Password *
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="appearance-none relative block w-full px-3 py-3 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                  placeholder="Ulangi password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div className="flex items-start space-x-2">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <label htmlFor="terms" className="text-sm text-gray-700">
              Dengan mendaftar, Anda menyetujui{' '}
              <button
                type="button"
                onClick={() => setShowTerms(true)}
                className="text-purple-600 hover:text-purple-500 underline"
              >
                Terms of Use
              </button>
              {' '}dan{' '}
              <button
                type="button"
                onClick={() => setShowPrivacy(true)}
                className="text-purple-600 hover:text-purple-500 underline"
              >
                Privacy Policy
              </button>
              {' '}Creator's Community
            </label>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !agreedToTerms}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
            </button>
          </div>
        </form>
      </div>

      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
    </div>
  );
};

export default Register;