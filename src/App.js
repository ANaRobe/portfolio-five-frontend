import styles from "./App.module.css";
import NavBar from "./components/NavBar";
import Container from "react-bootstrap/Container";
import { Route, Switch } from "react-router-dom";
import "./api/axiosDefaults";
import SignUpForm from "./pages/auth/SignUpForm";
import SignInForm from "./pages/auth/SignInForm";
import CreatePostForm from "./pages/posts/CreatePostForm";
import PostPage from "./pages/posts/PostPage";
import PostsPage from "./pages/posts/PostsPage";
import { useCurrentUser } from "./contexts/CurrentUserContext";
import EditPostForm from "./pages/posts/EditPostForm";
import ProfilePage from "./pages/profiles/ProfilePage";
import UsernameForm from "./pages/profiles/UsernameForm";
import UserPasswordForm from "./pages/profiles/UserPasswordForm";
import EditProfileForm from "./pages/profiles/EditProfileForm";
import CreateWorkshopForm from './pages/workshops/CreateWorkshopForm';
import WorkshopPage from "./pages/workshops/WorkshopPage";
import WorkshopsPage from "./pages/workshops/WorkshopsPage";
import EditWorkshopForm from "./pages/workshops/EditWorkshopForm";
import CreateContactForm from "./pages/contacts/CreateContactForm";
import ConfirmationPage from './pages/contacts/ConfirmationPage';
import NotFound from './components/NotFound';


function App() {
  const currentUser = useCurrentUser();
  const profile_id = currentUser?.profile_id || "";

  return (
  
        <div className={styles.App}>
          <NavBar />
          <Container className={styles.Main}>
            <Switch>
            <Route
            exact
            path="/"
            render={() => (
              <PostsPage message="No results found. Adjust the search keyword." />
            )}
          />
          <Route
            exact
            path="/feed"
            render={() => (
              <PostsPage
                message="No results found. Adjust the search keyword or follow a user."
                filter={`owner__followed__owner__profile=${profile_id}&`}
              />
            )}
          />
          <Route
            exact
            path="/liked"
            render={() => (
              <PostsPage
                message="No results found. Adjust the search keyword or like a post."
                filter={`likes__owner__profile=${profile_id}&ordering=-likes__created_at&`}
              />
            )}
          />
              <Route exact path="/signin" render={() => <SignInForm />} />
              <Route exact path="/signup" render={() => <SignUpForm />} />
              <Route exact path="/posts/create" render={() => <CreatePostForm />} />
              <Route exact path="/posts/:id"  render={() => <PostPage />} />
              <Route exact path="/posts/:id/edit" render={() => <EditPostForm />} />
              <Route exact path="/profiles/:id" render={() => <ProfilePage />} />
              <Route
                exact
                path="/profiles/:id/edit/username"
                render={() => <UsernameForm />}
              />
              <Route
                exact
                path="/profiles/:id/edit/password"
                render={() => <UserPasswordForm />}
              />
              <Route
                exact
                path="/profiles/:id/edit"
                render={() => <EditProfileForm />}
              />
              <Route exact path="/workshops"  render={() => <WorkshopsPage />} />
              <Route exact path="/workshops/create" render={() => <CreateWorkshopForm />} />
              <Route exact path="/workshops/:id"  render={() => <WorkshopPage />} />
              <Route exact path="/workshops/:id/edit" render={() => <EditWorkshopForm />} />
              <Route exact path="/contact" render={() => <CreateContactForm />} />
              <Route exact path="/confirmation" render={() => <ConfirmationPage />} />
              <Route render={() => <NotFound />} />
              
            </Switch>
          </Container>
        </div>
  );
}

export default App;