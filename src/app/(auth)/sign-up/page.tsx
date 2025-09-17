import RegisterForm from "./_components/register-form";

const RegisterPage = () => {
  return (
    <div className="border p-5 rounded-lg shadow-sm space-y-8">
      <div>
        <h1 className="text-lg font-semibold">Sign Up</h1>
        <p className="text-sm text-muted-foreground">
          Register to continue using this app.
        </p>
      </div>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
