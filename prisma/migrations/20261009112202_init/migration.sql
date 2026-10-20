-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" VARCHAR(500) NOT NULL,
    "content" TEXT NOT NULL,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "author_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "incident_type" VARCHAR(50),
    "severity" VARCHAR(20),
    "reported_at" TIMESTAMP(3),
    "affected_system" VARCHAR(255),
    "affected_department" VARCHAR(50),
    "affected_users" INTEGER,
    "reporter" VARCHAR(100),
    "evidence_files" JSONB,
    "status" VARCHAR(20) NOT NULL DEFAULT 'OPEN',
    "assigned_analyst" VARCHAR(100),

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_assessments" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "organization_sector" TEXT NOT NULL,
    "organization_type" TEXT NOT NULL,
    "critical_infrastructure_status" TEXT NOT NULL,
    "total_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "compliance_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "compliance_answers" (
    "id" SERIAL NOT NULL,
    "assessment_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "answer_value" INTEGER NOT NULL,
    "awarded_points" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "compliance_answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_testing_bookings" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "testing_type" VARCHAR(50) NOT NULL,
    "scope" TEXT NOT NULL,
    "start_date" VARCHAR(10) NOT NULL,
    "end_date" VARCHAR(10) NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    "terms_accepted" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_testing_bookings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "compliance_assessments_user_id_idx" ON "compliance_assessments"("user_id");

-- CreateIndex
CREATE INDEX "compliance_answers_assessment_id_idx" ON "compliance_answers"("assessment_id");

-- CreateIndex
CREATE INDEX "security_testing_bookings_user_id_idx" ON "security_testing_bookings"("user_id");

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_assessments" ADD CONSTRAINT "compliance_assessments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "compliance_answers" ADD CONSTRAINT "compliance_answers_assessment_id_fkey" FOREIGN KEY ("assessment_id") REFERENCES "compliance_assessments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "security_testing_bookings" ADD CONSTRAINT "security_testing_bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
