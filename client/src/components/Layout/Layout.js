const Layout = props => {
  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-8 col-sm-10 col-11 mt-3">{props.children}</div>
      </div>
    </div>
  )
};

export default Layout;