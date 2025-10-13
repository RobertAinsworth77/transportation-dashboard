import RouteAlignmentEntity from "../../domain/entities/RouteAlignmentEntity";

export default class RouteAlignmentDto {
  id: number;
  country: string;
  city: string;
  community: string;
  created_date?: string;
  is_active?: boolean;

  constructor(
    id: number,
    country: string,
    city: string,
    community: string,
    created_date?: string,
    is_active?: boolean
  ) {
    this.id = id;
    this.country = country;
    this.city = city;
    this.community = community;
    this.created_date = created_date;
    this.is_active = is_active;
  }

  static fromEntity(entity: RouteAlignmentEntity): RouteAlignmentDto {
    return new RouteAlignmentDto(
      entity.id,
      entity.country,
      entity.city,
      entity.community,
      entity.created_date,
      entity.is_active
    );
  }

  toEntity(): RouteAlignmentEntity {
    return {
      id: this.id,
      country: this.country,
      city: this.city,
      community: this.community,
      created_date: this.created_date,
      is_active: this.is_active,
    };
  }
}
