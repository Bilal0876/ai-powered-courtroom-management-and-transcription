const supabaseAdmin = require('../supabaseAdmin');

/**
 * Middleware to authenticate JWT token from Supabase
 * Validates the token and attaches user info to req.user
 */
async function authenticateToken(req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authentication token required'
            });
        }

        // Verify token with Supabase
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }

        // Attach user info to request
        req.user = {
            id: user.id,
            email: user.email,
            authUid: user.id
        };

        next();
    } catch (error) {
        console.error('Token authentication error:', error);
        return res.status(401).json({
            success: false,
            message: 'Authentication failed'
        });
    }
}

/**
 * Middleware to check if authenticated user has required role
 * Must be used after authenticateToken
 * @param {Array<string>} allowedRoles - Array of allowed roles (e.g., ['admin', 'chief-judge'])
 */
function requireRole(allowedRoles) {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.authUid) {
                return res.status(401).json({
                    success: false,
                    message: 'Authentication required'
                });
            }

            const db = req.db;
            const authUid = req.user.authUid;

            // Map roles to their respective tables and fields
            const roleConfig = {
                'admin': {
                    table: 'admin_info',
                    emailField: 'admin_email',
                    codeField: 'admin_code'
                },
                'judge': {
                    table: 'judge_info',
                    emailField: 'judge_email',
                    codeField: 'judge_code'
                },
                'chief-judge': {
                    table: 'chief_judge_info',
                    emailField: 'chief_judge_email',
                    codeField: 'chief_judge_code'
                },
                'stenographer': {
                    table: 'stenographer_info',
                    emailField: 'steno_email',
                    codeField: 'steno_code'
                }
            };

            // Try to find user in each allowed role table
            let userData = null;
            let userRole = null;

            for (const role of allowedRoles) {
                const config = roleConfig[role];
                if (!config) continue;

                const query = `SELECT * FROM ${config.table} WHERE auth_uid = $1`;
                const result = await db.query(query, [authUid]);

                if (result.rows.length > 0) {
                    userData = result.rows[0];
                    userRole = role;
                    break;
                }
            }

            if (!userData) {
                return res.status(403).json({
                    success: false,
                    message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
                });
            }

            // Attach role and user data to request
            const config = roleConfig[userRole];
            req.user.role = userRole;
            req.user.code = userData[config.codeField];
            req.user.data = userData;

            next();
        } catch (error) {
            console.error('Role verification error:', error);
            return res.status(500).json({
                success: false,
                message: 'Role verification failed'
            });
        }
    };
}

/**
 * Optional authentication middleware for backward compatibility
 * Accepts either token OR headers during migration period
 */
async function authenticateOptional(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    // If token is provided, use token authentication
    if (token) {
        return authenticateToken(req, res, next);
    }

    // Otherwise, fall back to header-based (legacy)
    const role = req.headers['x-role'];
    const userCode = req.headers['x-user-code'];

    if (role && userCode) {
        // Legacy header-based auth (still insecure, but allows gradual migration)
        req.user = {
            role: role,
            code: userCode,
            legacy: true // Flag to identify legacy auth
        };
        next();
    } else {
        return res.status(401).json({
            success: false,
            message: 'Authentication required (token or headers)'
        });
    }
}

module.exports = {
    authenticateToken,
    requireRole,
    authenticateOptional
};
