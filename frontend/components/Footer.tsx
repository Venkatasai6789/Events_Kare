
import React from 'react';
import { Github, Twitter, Instagram, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <span className="font-bold text-xl text-slate-900 tracking-tight">Campus Connect</span>
            </div>
            <p className="text-slate-500 text-sm max-w-sm mb-8 leading-relaxed">
              Empowering students to discover opportunities, track progress, and celebrate achievements within their campus community.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all">
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Platform</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-blue-600">Events Directory</a></li>
              <li><a href="#" className="hover:text-blue-600">Clubs & Societies</a></li>
              <li><a href="#" className="hover:text-blue-600">Credit Tracking</a></li>
              <li><a href="#" className="hover:text-blue-600">Certificates</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Student Resources</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li><a href="#" className="hover:text-blue-600">Getting Started</a></li>
              <li><a href="#" className="hover:text-blue-600">Credit Guidelines</a></li>
              <li><a href="#" className="hover:text-blue-600">FAQs</a></li>
              <li><a href="#" className="hover:text-blue-600">Support Center</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-6">Contact</h4>
            <ul className="space-y-4 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@campus.edu</span>
              </li>
              <li>Office of Student Affairs</li>
              <li>Building A, Room 102</li>
              <li>University Campus</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400 font-medium">
          <p>© 2024 Campus Connect. All rights reserved.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-900 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
