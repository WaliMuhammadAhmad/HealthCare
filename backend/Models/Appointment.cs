public class Appointment
{
    public int AppointmentID { get; set; }
    public int PatientID { get; set; }
    public int DoctorID { get; set; }
    public DateTime AppointmentDate { get; set; }
    public TimeSpan AppointmentTime { get; set; }
    public string? AppointmentType { get; set; }
    public string? ReasonForVisit { get; set; }
    public required string AppointmentStatus { get; set; }
    public string? Notes { get; set; }
    public string? CancellationReason { get; set; }
    public string? RescheduleReason { get; set; }
    public DateTime? RescheduleDate { get; set; }
    public TimeSpan? RescheduleTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public required Patient Patient { get; set; }
    public required Doctor Doctor { get; set; }
}