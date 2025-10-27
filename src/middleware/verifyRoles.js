export const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401);

    let rolesArray = [];

    // Handle different role structures
    if (Array.isArray(req.roles)) {
      // If roles are already in array format
      rolesArray = req.roles;
    } 
    else if (typeof req.roles === "object" && req.roles !== null) {
      // If roles are in nested object structure
      Object.values(req.roles).forEach((roleGroup) => {
        if (Array.isArray(roleGroup)) {
          rolesArray.push(...roleGroup);
        } else if (roleGroup) {
          // Handle single string role
          rolesArray.push(roleGroup);
        }
      });
    } 
    else if (req.roles) {
      // Handle single role string
      rolesArray = [req.roles];
    }

    // Validate processed roles
    if (!Array.isArray(rolesArray) || rolesArray.length === 0) {
      console.error("verifyRoles: No valid roles found after processing:", {
        originalRoles: req.roles,
        processedRoles: rolesArray,
        allowedRoles,
      });
      return res.sendStatus(401);
    }

    // Filter out invalid role values
    rolesArray = rolesArray.filter(
      (role) => role && typeof role === "string" && role.trim() !== ""
    );

    if (rolesArray.length === 0) {
      console.error("verifyRoles: No valid string roles found after filtering:", {
        originalRoles: req.roles,
        processedRoles: rolesArray,
        allowedRoles,
      });
      return res.sendStatus(401);
    }

    // Check if user has at least one allowed role
    const result = rolesArray
      .map((role) => allowedRoles.includes(role))
      .find((val) => val === true);

    if (!result) {
      console.log(
        "verifyRoles: Access denied. User roles:",
        rolesArray,
        "Required roles:",
        allowedRoles
      );
      return res.sendStatus(403);
    }

    next();
  };
};
