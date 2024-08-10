export interface Publication {
      publicationId: string,
      published: boolean;
      contactSchedule: string;
      title: string;
      description: string;
      price: number;
      itemId?: string;
      permalink?: string;
      sold: boolean;
}
