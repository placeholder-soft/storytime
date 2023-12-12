import { db } from "../firebase.ts";
import { useEffect, useState } from "react";
import { Project } from "model";
import {
  collection,
  onSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Link, useNavigate } from "react-router-dom";
import { User } from "firebase/auth";
import { Container, Button } from "@radix-ui/themes";
import { protectedRoute } from "../components/protectedRoute.tsx";

const DashboardPage = protectedRoute(({ user }: { user: User }) => {
  const [projects, setProjects] = useState<QueryDocumentSnapshot<Project>[]>();
  const navigate = useNavigate();
  useEffect(() => {
    onSnapshot(collection(db, `users/${user.uid}/projects`), (snapshot) => {
      setProjects(
        snapshot.docs.map((x) => x as QueryDocumentSnapshot<Project>)
      );
    });
  }, [user.uid]);
  if (projects == null) {
    return <div>Loading...</div>;
  }
  if (projects.length === 0) {
    return (
      <Container>
        Create Your own Adventure
        <Button
          onClick={() => {
            navigate("/name");
          }}
        >
          Get Started
        </Button>
      </Container>
    );
  }
  return (
    <div>
      <h1>Dashboard</h1>
      {projects.map((project) => (
        <Link to={`/projects/${project.id}`}>
          <h2>{project.data().name}</h2>
          <p>{project.data().title}</p>
        </Link>
      ))}
      {projects.length === 0 && <Link to="/canvas">New Project</Link>}
    </div>
  );
});

export default DashboardPage;
