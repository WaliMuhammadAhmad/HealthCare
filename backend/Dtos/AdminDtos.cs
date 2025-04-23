    public class LoginRequest
    {
        public string? Email { get; set; }
        public string? Password { get; set; }
    }

    public class EditAdminInfoDto
    {
        public required string Name { get; set; }
        public required string Email { get; set; }
        public required string Username { get; set; }
        public string? ProfilePic { get; set; }
    }

    public class PasswordUpdateRequest
    {
        public string? NewPassword { get; set; }
        public string? OldPassword { get; set; }
    }