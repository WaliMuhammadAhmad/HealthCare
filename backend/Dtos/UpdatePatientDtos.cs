public class UpdatePatientInfo 
{
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public string? ProfilePic { get; set; }
    public string? Address { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Gender { get; set; }
    public string? EmergencyContact { get; set; }
    public string? EmergencyContactName { get; set; }
}
public class UpdatePatientAccountStatusDto
{
    public required string AccountStatus { get; set; }
}