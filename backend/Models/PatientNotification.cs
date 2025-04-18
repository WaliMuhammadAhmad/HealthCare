public class PatientNotification
{
    public int Id { get; set; }
    public int PatientID { get; set; }
    public required string NotificationType { get; set; }
    public bool AppointmentReminders { get; set; }
    public bool AppointmentChanges { get; set; }
    public bool MedicalUpdates { get; set; }
    public bool IsEnabled { get; set; }

    public required Patient Patient { get; set; }
}