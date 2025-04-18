public class Doctor
{
    public int DoctorID { get; set; }
    public required string FullName { get; set; }
    public required string Email { get; set; }
    public string? Specialty { get; set; }
    public required string Status { get; set; }
    public string? ServiceDays { get; set; }
    public string? AvailabilityTimes { get; set; }
    public string? Bio { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public ICollection<Appointment>? Appointments { get; set; }
}