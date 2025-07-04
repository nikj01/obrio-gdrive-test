import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../common/prisma/prisma.service";
import { PrismaErrorHandler } from "../common/prisma/prisma.error-handler";
import { CreateJobDto } from "./dtos/create-job.dto";
import { JobRecord, JobStatus } from "@prisma/client";
import { UpdateJobDto } from "./dtos/update-job.dto";

@Injectable()
export class JobsRepository {
  private readonly logger = new Logger(JobsRepository.name);

  constructor(private readonly prismaService: PrismaService) {}

  @PrismaErrorHandler()
  async createJobRecord(dto: CreateJobDto): Promise<JobRecord> {
    this.logger.log("Creating a new job record");

    const createdJobRecord: JobRecord = await this.prismaService.jobRecord.create({
      data: { ...dto },
    });

    this.logger.log("Job record created successfully");
    return createdJobRecord;
  }

  @PrismaErrorHandler()
  async getJobRecordById(id: string): Promise<JobRecord> {
    this.logger.log(`Fetching job record with ID: ${id}`);
    const jobRecord: JobRecord | null = await this.prismaService.jobRecord.findUnique({
      where: { id },
    });

    if (!jobRecord) {
      this.logger.warn(`Job record with ID: ${id} not found`);
      throw new Error(`Job record with ID: ${id} not found`);
    }

    this.logger.log(`Job record with ID: ${id} fetched successfully`);
    return jobRecord;
  }

  @PrismaErrorHandler()
  async getJobRecordByJobId(jobId: number): Promise<JobRecord> {
    this.logger.log(`Fetching job record with Job ID: ${jobId}`);
    const jobRecord: JobRecord | null = await this.prismaService.jobRecord.findUnique({
      where: { jobId },
    });

    if (!jobRecord) {
      this.logger.warn(`Job record with Job ID: ${jobId} not found`);
      throw new Error(`Job record with Job ID: ${jobId} not found`);
    }

    this.logger.log(`Job record with Job ID: ${jobId} fetched successfully`);
    return jobRecord;
  }

  @PrismaErrorHandler()
  async getJobsRecordsByFileId(fileId: string): Promise<JobRecord[]> {
    this.logger.log(`Fetching jobs records for file ID: ${fileId}`);
    const jobsRecords: JobRecord[] = await this.prismaService.jobRecord.findMany({
      where: { fileId },
    });

    if (!jobsRecords || jobsRecords.length === 0) {
      this.logger.warn(`No jobs records found for file ID: ${fileId}`);
      throw new Error(`No jobs records found for file ID: ${fileId}`);
    }

    this.logger.log(`Jobs records for file ID: ${fileId} fetched successfully`);
    return jobsRecords;
  }

  @PrismaErrorHandler()
  async setJobRecordStatusCompleted(dto: UpdateJobDto): Promise<JobRecord> {
    const { transaction, id } = dto;
    this.logger.log(`Updating job record status for Job ID: ${id}`);

    const updatedJob: JobRecord = await transaction.jobRecord.update({
      where: { id },
      data: { status: JobStatus.COMPLETED, updatedAt: new Date() },
    });

    this.logger.log(`Job record status for Job ID: ${id} updated successfully`);
    return updatedJob;
  }

  @PrismaErrorHandler()
  async setJobRecordStatusFailed(dto: UpdateJobDto): Promise<JobRecord> {
    const { transaction, id } = dto;
    this.logger.log(`Setting job record status to FAILED for Job ID: ${id}`);

    const updatedJob: JobRecord = await transaction.jobRecord.update({
      where: { id },
      data: {
        status: JobStatus.FAILED,
        updatedAt: new Date(),
        failedAt: new Date(),
      },
    });

    this.logger.log(`Job record status for Job ID: ${id} set to FAILED successfully`);
    return updatedJob;
  }
}
