import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Form } from "radix-ui";
import VantaBg from "../components/VantaBg";
import { useLoginMutation, useRegisterMutation } from "../api/auth/mutation";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { mutate: loginMutate } = useLoginMutation();
  const { mutate: registerMutate } = useRegisterMutation();
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    if (isLogin) {
      loginMutate(data);
    } else {
      registerMutate(data);
    }
  };

  return (
    <div className="relative min-h-screen min-w-screen overflow-hidden flex items-center justify-center ">
      {/* Animated Sky Background */}
      <div className="absolute w-screen h-screen top-0 z-0 right-0">
        <VantaBg />
      </div>

      {/* Auth Cards Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <AnimatePresence mode="wait">
            {/* Left Card */}
            <motion.div
              key={isLogin ? "signup-left" : "login-left"}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="order-2 lg:order-1"
            >
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 lg:p-12 h-full flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
                    {isLogin ? "New Here?" : "Welcome Back!"}
                  </h2>
                  <p className="text-gray-600 mb-8 text-lg">
                    {isLogin
                      ? "Sign up and discover a great amount of new opportunities!"
                      : "To keep connected with us please login with your personal info"}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsLogin(!isLogin)}
                    className="w-full py-3 px-6 border-2 border-blue-500 text-blue-500 rounded-full font-semibold hover:bg-blue-50 transition-colors duration-300"
                  >
                    {isLogin ? "SIGN UP" : "LOGIN"}
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Card - Form */}
            <motion.div
              key={isLogin ? "login-right" : "signup-right"}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.5 }}
              className="order-1 lg:order-2 "
            >
              <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8 lg:p-12">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-8 text-center">
                    {isLogin ? "Login" : "Sign Up"}
                  </h2>

                  <Form.Root onSubmit={handleSubmit} className="space-y-6">
                    {/* NAME (only in signup) */}
                    {!isLogin && (
                      <Form.Field name="name" className="space-y-1">
                        <div className="flex justify-between">
                          <Form.Label className="text-gray-700 font-medium">
                            Name
                          </Form.Label>
                          <Form.Message
                            match="valueMissing"
                            className="text-red-500 text-sm"
                          >
                            Please enter your name
                          </Form.Message>
                        </div>

                        <Form.Control asChild>
                          <input
                            type="text"
                            required={!isLogin}
                            placeholder="Please enter your name"
                            className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </Form.Control>
                      </Form.Field>
                    )}

                    {/* EMAIL */}
                    <Form.Field name="email" className="space-y-1">
                      <div className="flex justify-between">
                        <Form.Label className="text-gray-700 font-medium">
                          Email
                        </Form.Label>

                        <Form.Message
                          match="valueMissing"
                          className="text-red-500 text-sm"
                        >
                          Email is required
                        </Form.Message>

                        <Form.Message
                          match="typeMismatch"
                          className="text-red-500 text-sm"
                        >
                          Please provide a valid email
                        </Form.Message>
                      </div>

                      <Form.Control asChild>
                        <input
                          type="email"
                          required
                          placeholder="Please enter your email"
                          className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </Form.Control>
                    </Form.Field>

                    {/* PASSWORD */}
                    <Form.Field name="password" className="space-y-1">
                      <div className="flex justify-between">
                        <Form.Label className="text-gray-700 font-medium">
                          Password
                        </Form.Label>

                        <Form.Message
                          match="valueMissing"
                          className="text-red-500 text-sm"
                        >
                          Password is required
                        </Form.Message>
                      </div>

                      <Form.Control asChild>
                        <input
                          type="password"
                          required
                          placeholder="Please enter your password"
                          className="w-full px-4 py-3 bg-gray-100 border-0 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </Form.Control>
                    </Form.Field>

                    {/* Forgot password (login only) */}
                    {isLogin && (
                      <div className="text-right">
                        <button
                          type="button"
                          className="text-sm text-white px-5 py-2 rounded-xl bg-purple-950 hover:underline"
                        >
                          Forgot Password?
                        </button>
                      </div>
                    )}

                    {/* SUBMIT BUTTON */}
                    <Form.Submit asChild>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full py-3 px-6 bg-linear-to-r from-blue-500 to-blue-800 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isLogin ? "LOGIN" : "SIGN UP"}
                      </motion.button>
                    </Form.Submit>
                  </Form.Root>

                  <div className="mt-6 text-center lg:hidden">
                    <p className="text-gray-600 mb-2">
                      {isLogin
                        ? "Don't have an account?"
                        : "Already have an account?"}
                    </p>
                    <button
                      onClick={() => setIsLogin(!isLogin)}
                      className="text-blue-500 font-semibold hover:underline"
                    >
                      {isLogin ? "Sign Up" : "Login"}
                    </button>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
