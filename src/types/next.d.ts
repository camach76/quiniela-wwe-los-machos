import 'next';

declare module 'next' {
  export interface NextPageProps {
    params: Record<string, string>;
    searchParams: Record<string, string | string[] | undefined>;
  }
}
