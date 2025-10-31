output "s3_bucket_name" {
  value = aws_s3_bucket.agri_data.bucket
}
output "sns_topic_arn" {
  value = aws_sns_topic.irrigation_alerts.arn
}
output "sagemaker_role_arn" {
  value = aws_iam_role.sagemaker_role.arn
}
