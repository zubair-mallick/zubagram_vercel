import React, { useEffect, useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import axios from 'axios';
import { toast } from 'sonner';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import logo from '../assets/zubagramlogo.png'; // Adjust the path as needed

const Login = () => {
    const [input, setInput] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const signupHandler = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await axios.post('zubagram-vercel-4d4f.vercel.app/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setAuthUser(res.data.user));
                navigate("/");
                toast.success(res.data.message);
                setInput({
                    email: "",
                    password: ""
                });
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    return (
        <div className='flex items-center w-screen h-screen justify-center  text-white'>
            <form onSubmit={signupHandler} className='shadow-lg flex flex-col gap-5 p-8 bg-gray-800 rounded-md'>
                <div className='my-4 flex items-center justify-center gap-2 uppercase bg-purple-800 rounded-lg bs'>
                    <img src={logo} alt="Zubagram Logo" className='h-12' />
                    <h1 className='text-center font-bold text-xl'>Zubagram</h1>
                </div>
                <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 bg-gray-700 text-white"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2 bg-gray-700 text-white"
                    />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit' className='bg-blue-600 hover:bg-blue-500'>Login</Button>
                    )
                }

                <span className='text-center'>
                    Doesn’t have an account? <Link to="/signup" className='text-blue-400 hover:underline'>Signup</Link>
                </span>
            </form>
        </div>
    );
}

export default Login;
