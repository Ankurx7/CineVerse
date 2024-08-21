import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

import Home from './CommonPages/Home';
import Header from './CommonPages/Header';
import Footer from './CommonPages/Footer';
import NotFound from './CommonPages/NotFound';
import ErrorBoundary from './components/Pages/ErrorBoundary';
import PrivateRoute from './components/Pages/Routes';
import LoginScreen from './components/AuthorizationPages/LoginScreen';
import RegisterScreen from './components/AuthorizationPages/RegisterScreen';
import ForgotPasswordScreen from './components/AuthorizationPages/ForgotPasswordScreen';
import ResetPasswordScreen from './components/AuthorizationPages/ResetPasswordScreen';
import AddStory from './components/Pages/AddStory';
import DetailStory from './components/Pages/DetailStory';
import LoginPrompt from './components/Pages/LoginPrompt';
import Profile from './components/Pages/Profile';
import EditProfile from './components/Pages/EditProfile';
import ChangePassword from './components/Pages/ChangePassword';
import EditStory from './components/Pages/EditStory';
      

const App = () => {
      const Base = () => {
            return (
              <>
                <Header />
                <Outlet />
                <Footer />
              </>
            );
          };
  return (
    <Router>
      <div className="App">
      <ErrorBoundary>
        <Routes>

        <Route path="/login" element={<LoginScreen />} />
        <Route path="/register" element={<RegisterScreen />} />
        <Route path="/forgotpassword" element={<ForgotPasswordScreen />} />
        <Route path="/resetpassword" element={<ResetPasswordScreen />} />

          <Route path="/" element={ <Base />}>
            <Route path="*" element={<NotFound />} />



            <Route path="/" element={<PrivateRoute />}>
              <Route index element={<Home />} />
            </Route>

            <Route path="/login-prompt" element={<LoginPrompt />} />
            <Route path="/story/:slug" element={<DetailStory />} />
            
            <Route path="/story/:slug/like" element={<PrivateRoute />}>
              <Route index element={<DetailStory />} />
            </Route>
            <Route path="/story/:slug/edit" element={<PrivateRoute />}>
              <Route index element={<EditStory />} />
            </Route>
            <Route path="/story/:slug/delete" element={<PrivateRoute />}>
              <Route index element={<DetailStory />} />
            </Route>
            <Route path="/story/:slug/addComment" element={<PrivateRoute />}>
              <Route index element={<DetailStory />} />
            </Route>

            <Route path="/addstory" element={<PrivateRoute />}>
              <Route index element={<AddStory />} />
            </Route>



            <Route path="/profile" element={<PrivateRoute />}>
              <Route index element={<Profile />} />
            </Route>
            <Route path="/edit_profile" element={<PrivateRoute />}>
              <Route index element={<EditProfile />} />
            </Route>
            <Route path="/change_password" element={<PrivateRoute />}>
              <Route index element={<ChangePassword />} />
            </Route>


           
          </Route>
        </Routes>
        </ErrorBoundary>
      </div>
    </Router>
  );
};


export default App;
