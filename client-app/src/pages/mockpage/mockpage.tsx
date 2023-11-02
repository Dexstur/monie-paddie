function MockPage() {
  const apiBaseUrl = "http://localhost:5500";
  return (
    <div>
      <>
        <h2 className="text-center py-5">
          We would be using bootstrap for this project
        </h2>
        <p className="text-center">
          Bootstrap makes certain aspects of css easy.
        </p>
        <div className="text-center">
          <a
            className="btn btn-primary"
            href="https://getbootstrap.com/docs/5.3/getting-started/introduction/"
            target="_blank"
          >
            Learn bootstrap
          </a>
        </div>

        <div className="text-center">
          <a className="btn btn-primary" href={`${apiBaseUrl}/auth/google`}>
            continue with google
          </a>
        </div>
        <br />
        <div className="text-center">
          <a
            href="/signup"
            className="btn btn-success mx-2 my-3 d-block d-sm-inline"
          >
            Signup Page
          </a>
          <a
            href="/signup"
            className="btn btn-primary mx-2 my-3 d-block d-sm-inline"
          >
            Login Page
          </a>
        </div>
      </>
    </div>
  );
}

export default MockPage;