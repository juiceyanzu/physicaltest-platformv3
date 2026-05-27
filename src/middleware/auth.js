} catch (e) {
    // If token verification fails or database check fails
    console.error('Authentication error:', e);
    
    // For token verification errors (expired, invalid), return 401
    if (e.name === 'TokenExpiredError' || e.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid or expired token' });
    }
    
    // If DB check fails, return 503 (service unavailable) instead of allowing through
    console.error('Database error during authentication:', e);
    return res.status(503).json({ success: false, message: '服务异常，请稍后重试' });
}
