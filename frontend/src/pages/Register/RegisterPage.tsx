import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "../../components/ui/Button/Button";
import { Input } from "../../components/ui/Input/Input";
import { Card } from "../../components/ui/Card/Card";

export default function RegisterPage() {
    const navigate = useNavigate();
    const[form, setForm] = useState({
        name:"",
        email:"",
        password:"",
        confirmPassword:"",
    });
    const handleRegister = () => {
        navigate("/login");
    };
    return (
        <div className="flex min-h-screen items-center justify-center">
            <Card className="w-full max-w-md p-6">
                <h1 className="mb-6 text-2xl font-bold">Register</h1>

                <div className="space-y-4">
                    <Input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                    <Input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    <Input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                    <Input type="password" placeholder="Confirm Password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} />
                    <Button className="w-full" onClick={handleRegister}>Register</Button>
                    <p className="text-center text-sm">Already have an account?{" "}
                        <Link to="/login" className="text-blue-500">Login</Link>
                    </p>
                </div>
            </Card>
        </div>
    );
}