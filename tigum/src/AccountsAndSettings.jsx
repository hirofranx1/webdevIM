

export default function AccountsAndSettings() {
    function onSubmit() {
      var item = {
          id: 1,
          FullName: document.getElementById('username').value,
          email: document.getElementById('email').value,
          password: document.getElementById('password').value,
          confirmpassword: document.getElementById('confirmPassword').value
      };
      
      if (item.FullName !== "" && item.email !== '' && item.password !== '' && item.confirmpassword) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(item.email)) {
              alert('Please enter a valid email address.');
              return;
          } else {
              fetch('http://localhost:3000/register',{
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify(item)
              })
              .then(res => res.json())
              .then(data => alert(data.message));
          }
      } else {
          alert('Please input all fields!');
      }
    }

  return (
    <div className="container border border-dark">
      <header className="header">
        <div className="img" alt="Line" />
        <div className="container">
          <div className="greetings-to-user">
            <div className="account-settings">Notch</div>
          </div>
        </div>
      </header>

      <div className="row mt-12">
        <div className="col-md-12">
          <div className="card">
            <div className="card-header">Account &amp; Settings</div>
            <div className="card-body">
                <div className="button-section">
            <button className="nav-btn btn btn-outline-primary" type="button">
              <div className="vector" alt="Vector" />
            </button>
            <button className="bell-btn btn btn-outline-primary" type="button">
              <div className="vector" alt="Vector" />
              <div className="ellipse" />
            </button>
          </div>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="username"
                  placeholder="Juan Dela Cruz"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="johndoe@gmail.com"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  placeholder="evFTbyVVCd"
                />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmPassword" className="form-label">
                  Confirm Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="evFTbyVVCd"
                />
                <br />
                <button type="submit" className="btn btn-dark" onClick={onSubmit}>
                Save Changes
              </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
   );
}
