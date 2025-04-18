public class Patient
{
    public int PatientID { get; set; }
    public required string FullName { get; set; }
    public required string Username { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
    public string? ProfilePic { get; set; }
    public string? PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? Address { get; set; }
    public string? EmergencyContactName { get; set; }
    public string? EmergencyContact { get; set; }
    public required string AccountStatus { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<PatientNotification>? Notifications { get; set; }
    public ICollection<Appointment>? Appointments { get; set; }
}