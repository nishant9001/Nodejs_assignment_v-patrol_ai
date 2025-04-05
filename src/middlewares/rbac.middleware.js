 const authorize = (role) => {
    return (req, res, next) => {
      if (req.user.role!=role) {
        return res.status(403).json({ message: `Forbidden: Access Denied! Only ${role} allowed` });
      }
      next();
    };
  };
  
  
  export default authorize;