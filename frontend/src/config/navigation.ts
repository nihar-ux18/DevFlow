import {LayoutDashboard, CheckSquare, NotebookPen, GraduationCap, Timer, GitBranch, BarChart3, Bot, Settings} from 'lucide-react';

export const navigation = [
    {
        label : "Dashbaord",path : "/",icon : LayoutDashboard
    },
    {
        label : "Tasks",path : "/tasks",icon : CheckSquare
    },
    {
        label : "Notes",path : "/notes",icon : NotebookPen
    },
    {
        label : "Learning",path : "/learning",icon : GraduationCap
    },
    {
        label : "Focus",path : "/focus",icon : Timer
    },
    {
        label : "Github",path : "/github",icon : GitBranch
    },
    {
        label : "Analytics",path : "/analytics",icon : BarChart3
    },
    {
        label : "Assistant",path : "/assistant",icon : Bot
    },
    {
        label : "Settings",path : "/settings",icon : Settings
    },
];
