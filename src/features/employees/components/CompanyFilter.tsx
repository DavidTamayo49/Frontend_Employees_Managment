import { useCompanies } from '@/features/catalogs/hooks/useCatalogs'
import { Label } from '@/shared/ui/label'
import { NativeSelect } from '@/shared/ui/native-select'

type CompanyFilterProps = {
  value: string
  onChange: (companyId: string) => void
}

export function CompanyFilter({ value, onChange }: CompanyFilterProps) {
  const { data: companies, isPending } = useCompanies()

  return (
    <div className="grid gap-2 sm:w-72">
      <Label htmlFor="company-filter">Empresa</Label>
      <NativeSelect id="company-filter" value={value} disabled={isPending} onChange={(e) => onChange(e.target.value)}>
        <option value="">Todas</option>
        {companies?.map((company) => (
          <option key={company.id} value={company.id}>
            {company.name}
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}
