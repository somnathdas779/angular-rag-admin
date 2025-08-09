#!/bin/bash

# ====== CONFIGURATION ======
STACK_NAME="angular-app-stack"
TEMPLATE_FILE="angular-s3-cloudfront.yml"
BUCKET_NAME="rag-angular-app-prod"     # Change to your bucket name
DIST_ID=""                            # Will be auto-fetched after stack creation
ANGULAR_PROJECT_NAME="rag-admin" # Change to match dist/<project-name>
AWS_REGION="ap-east-1"

# ====== STEP 1: Deploy/Update CloudFormation Stack ======
echo "Deploying CloudFormation stack: $STACK_NAME..."

if aws cloudformation describe-stacks --stack-name "$STACK_NAME" &>/dev/null; then
  echo "Updating existing stack..."
  aws cloudformation update-stack \
    --stack-name "$STACK_NAME" \
    --template-body file://$TEMPLATE_FILE \
    --parameters ParameterKey=BucketName,ParameterValue=$BUCKET_NAME \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $AWS_REGION || echo "No updates to perform."
else
  echo "Creating new stack..."
  aws cloudformation create-stack \
    --stack-name "$STACK_NAME" \
    --template-body file://$TEMPLATE_FILE \
    --parameters ParameterKey=BucketName,ParameterValue=$BUCKET_NAME \
    --capabilities CAPABILITY_NAMED_IAM \
    --region $AWS_REGION
fi

echo "Waiting for stack to be ready..."
aws cloudformation wait stack-create-complete --stack-name "$STACK_NAME" --region $AWS_REGION || \
aws cloudformation wait stack-update-complete --stack-name "$STACK_NAME" --region $AWS_REGION

# ====== STEP 2: Get CloudFront Distribution ID from Stack ======
echo "Fetching CloudFront Distribution ID..."
DIST_ID=$(aws cloudformation describe-stack-resources \
  --stack-name "$STACK_NAME" \
  --region $AWS_REGION \
  --query "StackResources[?ResourceType=='AWS::CloudFront::Distribution'].PhysicalResourceId" \
  --output text)

echo "CloudFront Distribution ID: $DIST_ID"

# ====== STEP 3: Build Angular App ======
echo "Building Angular app..."
ng build --configuration production

# ====== STEP 4: Sync to S3 ======
echo "Uploading files to S3 bucket: $BUCKET_NAME..."
aws s3 sync dist/$ANGULAR_PROJECT_NAME s3://$BUCKET_NAME --delete --region $AWS_REGION

# ====== STEP 5: Invalidate CloudFront Cache ======
echo "Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id $DIST_ID \
  --paths "/*" \
  --region $AWS_REGION

echo "Deployment complete! 🎉"
