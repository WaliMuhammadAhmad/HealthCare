public class AppointmentDtos
    {
        public int AppointmentID { get; set; }
        public int PatientID { get; set; }
        public int DoctorID { get; set; }
        public DateTime AppointmentDate { get; set; }
        public TimeSpan AppointmentTime { get; set; }
        public string? AppointmentType { get; set; }
        public string? ReasonForVisit { get; set; }
        public string? AppointmentStatus { get; set; }
        public string? Notes { get; set; }
        public string? CancellationReason { get; set; }
        public string? RescheduleReason { get; set; }
        public DateTime? RescheduleDate { get; set; }
        public TimeSpan? RescheduleTime { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
}

public class AppointmentResponseDto
{
    public int AppointmentID { get; set; }
    public string? PatientName { get; set; }
    public string? PatientImage { get; set; }
    public string? PatientEmail { get; set; }

    public string? DoctorName { get; set; }
    public string? Specialty { get; set; }

    public DateTime AppointmentDate { get; set; }
    public TimeSpan AppointmentTime { get; set; }
    public string? AppointmentType { get; set; }
    public string? ReasonForVisit { get; set; }
    public string? AppointmentStatus { get; set; }
    public string? Notes { get; set; }
    public string? CancellationReason { get; set; }
    public string? RescheduleReason { get; set; }
    public DateTime? RescheduleDate { get; set; }
    public TimeSpan? RescheduleTime { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}