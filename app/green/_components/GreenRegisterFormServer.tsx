/**
 * Server-rendered form shell for SEO / no-JS smoke — replaced on hydrate by GreenActorRegisterForm.
 */
export function GreenRegisterFormServer() {
  return (
    <form
      className="green-form-panel mb-6 border p-6 md:p-8"
      aria-label="Référencer un acteur — formulaire"
      data-green-register-ssr
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-white/45">
        Étape 1 sur 1
      </p>
      <h2 className="mt-4 font-display text-lg font-semibold text-white">Vos informations</h2>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="block md:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
            Type d&apos;acteur
          </span>
          <select
            name="type"
            className="green-form-input mt-2 w-full rounded-lg px-4 py-3 text-sm text-white"
            defaultValue="producer"
          >
            <option value="producer">Producteur</option>
            <option value="storer">Stockeur</option>
            <option value="charger">Rechargeur</option>
            <option value="consumer">Consommateur</option>
          </select>
        </label>
        <label className="block md:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
            Nom de la structure
          </span>
          <input
            name="name"
            required
            className="green-form-input mt-2 w-full rounded-lg px-4 py-3 text-sm text-white"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">Ville</span>
          <input
            name="city"
            required
            className="green-form-input mt-2 w-full rounded-lg px-4 py-3 text-sm text-white"
          />
        </label>
        <label className="block">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">Pays</span>
          <input
            name="country"
            required
            className="green-form-input mt-2 w-full rounded-lg px-4 py-3 text-sm text-white"
          />
        </label>
        <label className="block md:col-span-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-white/50">
            E-mail professionnel
          </span>
          <input
            type="email"
            name="contactEmail"
            required
            className="green-form-input mt-2 w-full rounded-lg px-4 py-3 text-sm text-white"
          />
        </label>
      </div>
      <p className="mt-4 text-xs text-white/35" aria-hidden="true">
        Version interactive chargée ci-dessous si JavaScript est activé.
      </p>
    </form>
  );
}
