import { useForm, SubmitHandler } from "react-hook-form";
import cx from "clsx";
import { useMutation } from "@tanstack/react-query";
import { Navigate, useNavigate } from "react-router-dom";
import login from "../actions/login";
import { showToast } from "../utils/toastAlert";
import useUserTokenCookie from "../hooks/useUserTokenCookie";
import type { TLogin } from "../types/User";

function LoginOrSignup() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<TLogin>();
  const { tokenCookie, setUserTokenCookie } = useUserTokenCookie();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: login,
  });

  if (tokenCookie) return <Navigate to="/user/setting" />;

  const onSubmit: SubmitHandler<TLogin> = async (formData) => {
    try {
      const jwt = await loginMutation.mutateAsync(formData);
      showToast("success", "登入成功！");
      setUserTokenCookie(jwt);
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        showToast("error", error.message);
      }
    }
  };

  return (
    <div className="flex justify-center pt-10">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col justify-center w-1/3 gap-5 p-10 bg-gray-200"
      >
        <div className="flex items-center gap-3">
          <label>帳號</label>
          <input
            type="text"
            {...register("email", { required: true })}
            className="w-full max-w-xs input"
          />
          {errors.email && <span className="text-error">請輸入帳號</span>}
        </div>
        <div className="flex items-center gap-3">
          <label>密碼</label>
          <input
            type="password"
            {...register("password", { required: true })}
            className="w-full max-w-xs input"
          />
          {errors.password && <span className="text-error">請輸入密碼</span>}
        </div>
        <button
          className={cx("btn btn-primary", isSubmitting && "btn-disabled")}
        >
          {isSubmitting ? <span className="loading loading-spinner" /> : "登入"}
        </button>
      </form>
    </div>
  );
}

export default LoginOrSignup;
