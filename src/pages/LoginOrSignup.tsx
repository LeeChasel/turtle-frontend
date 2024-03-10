import { useForm, SubmitHandler } from "react-hook-form";
import cx from "clsx";
import { useMutation } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import login from "../actions/login";
import { showToast } from "../utils/toastAlert";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import type { TLogin } from "../types/User";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("請輸入正確的信箱格式"),
  password: z.string().min(1, { message: "請輸入密碼" }),
});

function LoginOrSignup() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<TLogin>();
  const { tokenCookie, setUserTokenCookie } = useUserTokenCookie();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
  });

  if (tokenCookie) return <Navigate to="/user/setting" />;

  const onSubmit: SubmitHandler<TLogin> = async (formData) => {
    try {
      const validatedData = loginSchema.parse(formData);
      const jwt = await loginMutation.mutateAsync(validatedData);
      showToast("success", "登入成功！");
      setUserTokenCookie(jwt);
      navigate("/");
    } catch (error) {
      if (error instanceof z.ZodError) {
        showToast("error", error.errors[0].message);
      } else if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  };

  return (
    <div className="flex justify-center pt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center max-w-xs gap-2 p-4 border border-black rounded-md shadow-md bg-gray-50"
      >
        <label className="w-full form-control">
          <span className="label label-text">電子信箱</span>
          <input
            {...register("email")}
            type="text"
            placeholder="name@example.com"
            className="bg-white shadow input input-bordered"
          />
        </label>
        <label className="w-full form-control">
          <span className="label label-text">密碼</span>
          <input
            {...register("password")}
            type="password"
            className="bg-white shadow input input-bordered"
          />
        </label>
        <button
          className={cx(
            "btn btn-outline w-2/3 mt-2",
            isSubmitting && "btn-disabled",
          )}
        >
          {isSubmitting ? <span className="loading loading-spinner" /> : "登入"}
        </button>
      </form>
    </div>
  );
}

export default LoginOrSignup;
