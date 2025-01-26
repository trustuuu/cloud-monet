"use client";

import Input from "../../components/input";
import Button from "../../components/button";
import SocialLogin from "../../components/social-login";
import { useFormState } from "react-dom";
import React from "react";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "../../lib/constants";

export default function Login() {
  //   const onClick = async () => {
  //     const response = await fetch("/api/users", {
  //       method: "POST",
  //       body: JSON.stringify({
  //         username: "yschang",
  //         password: "12345",
  //       }),
  //     });
  //     console.log(await response.json());
  //   };

  const [state, action] = useFormState(login, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">Welcome !</h1>
        <h2 className="text-xl">Log in with email and password.</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <Input
          type="email"
          name="email"
          placeholder="Email"
          required
          errors={state?.fieldErrors.email}
          //errors={[]}
        />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          required
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.password}
          //errors={state?.errors ?? []}
        />
        <Button text="Log In" />
      </form>
      {/* <span onClick={onClick}>
        <FormButton loading={false} text="Log In" />
      </span> */}
      <SocialLogin />
    </div>
  );
}
