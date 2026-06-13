import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";

import DashboardPage from "../../pages/Dashboard/DashboardPage";
import TasksPage from "../../pages/Tasks/TasksPage";
import NotesPage from "../../pages/Notes/NotesPage";

export default function AppRouter() {
  return(
    <BrowserRouter>
      <Routes>
        <Route element={<DashboardLayout/>}>
        <Route 
        	path="/"
			element={<DashboardPage/>}
		/>

		<Route 
        	path="/tasks"
			element={<TasksPage/>}
		/>

		<Route 
        	path="/notes"
			element={<NotesPage/>}
		/>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}