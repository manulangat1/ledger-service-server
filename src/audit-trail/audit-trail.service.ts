import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditTrail } from '../db/entities/audit-trail.entity';
import { Repository } from 'typeorm';
import { CreateAuditTrailDto } from './dto/create.dto';

@Injectable()
export class AuditTrailService {
  constructor(
    @InjectRepository(AuditTrail)
    private auditTrailRepository: Repository<AuditTrail>,
  ) {}

  async create(dto: CreateAuditTrailDto): Promise<AuditTrail> {
    const trail = await this.auditTrailRepository.create({
      ...dto,
    });
    return await this.auditTrailRepository.save(trail);
  }
}
