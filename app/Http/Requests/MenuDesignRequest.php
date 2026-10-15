<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class MenuDesignRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $hex = ['required', 'regex:/^#[0-9a-fA-F]{6}$/'];
        $url = fn (int $max = 255) => ['nullable', 'string', "max:$max", 'regex:/^(https?:\/\/|\/|#|mailto:|tel:)/i'];

        return [
            'design'          => ['required', 'array'],
            'design.version'  => ['required', 'integer'],
            'design.variant'  => ['required', 'in:header,footer'],

            'design.layout'                => ['required', 'array'],
            'design.layout.width'          => ['required', 'in:container,full'],
            'design.layout.maxWidth'       => ['required', 'integer', 'between:600,2000'],
            'design.layout.height'         => ['required', 'integer', 'between:40,200'],
            'design.layout.paddingX'       => ['required', 'integer', 'between:0,120'],
            'design.layout.itemGap'        => ['required', 'integer', 'between:0,80'],
            'design.layout.align'          => ['required', 'in:flex-start,center,flex-end,space-between'],
            'design.layout.logoPosition'   => ['required', 'in:left,center,right'],
            'design.layout.sticky'         => ['required', 'boolean'],
            'design.layout.shadow'         => ['required', 'boolean'],
            'design.layout.borderBottom'   => ['required', 'boolean'],
            'design.layout.borderWidth'    => ['required', 'integer', 'between:1,6'],
            'design.layout.columns'        => ['required', 'integer', 'between:1,6'],

            'design.logo'          => ['required', 'array'],
            'design.logo.type'     => ['required', 'in:none,text,image'],
            'design.logo.text'     => ['nullable', 'string', 'max:60'],
            'design.logo.imageUrl' => ['nullable', 'string', 'max:500'],
            'design.logo.height'   => ['required', 'integer', 'between:16,120'],

            'design.colors'              => ['required', 'array'],
            'design.colors.background'   => $hex,
            'design.colors.text'         => $hex,
            'design.colors.hover'        => $hex,
            'design.colors.active'       => $hex,
            'design.colors.border'       => $hex,
            'design.colors.dropdownBg'   => $hex,
            'design.colors.dropdownText' => $hex,
            'design.colors.buttonBg'     => $hex,
            'design.colors.buttonText'   => $hex,

            'design.typography'               => ['required', 'array'],
            'design.typography.fontFamily'    => ['required', 'string', 'max:200'],
            'design.typography.fontSize'      => ['required', 'integer', 'between:10,28'],
            'design.typography.fontWeight'    => ['required', 'integer', 'in:400,500,600,700'],
            'design.typography.uppercase'     => ['required', 'boolean'],
            'design.typography.letterSpacing' => ['required', 'numeric', 'between:0,4'],

            'design.dropdown'         => ['required', 'array'],
            'design.dropdown.radius'  => ['required', 'integer', 'between:0,24'],
            'design.dropdown.width'   => ['required', 'integer', 'between:140,400'],
            'design.dropdown.shadow'  => ['required', 'boolean'],

            'design.button'          => ['required', 'array'],
            'design.button.enabled'  => ['required', 'boolean'],
            'design.button.label'    => ['nullable', 'string', 'max:40'],
            'design.button.url'      => ['nullable', 'string', 'max:255'],
            'design.button.radius'   => ['required', 'integer', 'between:0,40'],

            'design.blocks'                => ['nullable', 'array', 'max:12'],
            'design.zones'                 => ['nullable', 'array'],
            'design.zones.left'            => ['nullable', 'array', 'max:30'],
            'design.zones.left.*'          => ['string', 'max:40'],
            'design.zones.center'          => ['nullable', 'array', 'max:30'],
            'design.zones.center.*'        => ['string', 'max:40'],
            'design.zones.right'           => ['nullable', 'array', 'max:30'],
            'design.zones.right.*'         => ['string', 'max:40'],
            'design.blocks.*.id'           => ['required', 'string', 'max:40'],
            'design.blocks.*.type'         => ['required', 'in:text,phone,search,social,button'],
            'design.blocks.*.zone'         => ['nullable', 'in:before,after'],
            'design.blocks.*.text'         => ['nullable', 'string', 'max:200'],
            'design.blocks.*.url'          => ['nullable', 'string', 'max:255'],
            'design.blocks.*.variant'      => ['nullable', 'in:filled,outline'],
            'design.blocks.*.facebook'     => ['nullable', 'string', 'max:255'],
            'design.blocks.*.instagram'    => ['nullable', 'string', 'max:255'],
            'design.blocks.*.x'            => ['nullable', 'string', 'max:255'],
            'design.blocks.*.linkedin'     => ['nullable', 'string', 'max:255'],
            'design.blocks.*.youtube'      => ['nullable', 'string', 'max:255'],

            // NEW: free-placement offsets from drag & drop ({ logo: {x, y}, menu: {x, y}, <blockId>: {x, y} })
            'design.positions'             => ['nullable', 'array', 'max:40'],
            'design.positions.*'           => ['array'],
            'design.positions.*.x'         => ['required', 'numeric', 'between:-5000,5000'],
            'design.positions.*.y'         => ['required', 'numeric', 'between:-5000,5000'],

            'design.mobile'                  => ['required', 'array'],
            'design.mobile.breakpoint'       => ['required', 'integer', 'between:480,1200'],
            'design.mobile.burgerPosition'   => ['required', 'in:left,right'],

            'design.footer'             => ['required', 'array'],
            'design.footer.copyright'   => ['nullable', 'string', 'max:200'],

            // NEW: footer images + blocks (needed once the footer blocks/images feature is applied)
            'design.footer.imagesSection'          => ['sometimes', 'array'],
            'design.footer.imagesSection.enabled'  => ['sometimes', 'boolean'],
            'design.footer.imagesSection.title'    => ['sometimes', 'nullable', 'string', 'max:80'],
            'design.footer.imagesSection.position' => ['sometimes', 'in:top,bottom'],
            'design.footer.imagesSection.align'    => ['sometimes', 'in:flex-start,center,flex-end'],
            'design.footer.imagesSection.height'   => ['sometimes', 'integer', 'between:16,200'],
            'design.footer.imagesSection.gap'      => ['sometimes', 'integer', 'between:0,64'],

            'design.footer.images'        => ['sometimes', 'array', 'max:12'],
            'design.footer.images.*.id'   => ['required', 'string', 'max:40'],
            'design.footer.images.*.url'  => $url(500),
            'design.footer.images.*.alt'  => ['nullable', 'string', 'max:120'],
            'design.footer.images.*.link' => $url(),

            'design.footer.blocks'                 => ['sometimes', 'array', 'max:12'],
            'design.footer.blocks.*.id'            => ['required', 'string', 'max:40'],
            'design.footer.blocks.*.type'          => ['required', 'in:menu,text,contact,social,newsletter'],
            'design.footer.blocks.*.title'         => ['nullable', 'string', 'max:80'],
            'design.footer.blocks.*.span'          => ['required', 'integer', 'between:1,6'],
            'design.footer.blocks.*.x'             => ['required', 'integer', 'between:-2000,2000'],
            'design.footer.blocks.*.y'             => ['required', 'integer', 'between:-2000,2000'],
            'design.footer.blocks.*.text'          => ['nullable', 'string', 'max:1000'],
            'design.footer.blocks.*.address'       => ['nullable', 'string', 'max:200'],
            'design.footer.blocks.*.phone'         => ['nullable', 'string', 'max:40'],
            'design.footer.blocks.*.email'         => ['nullable', 'string', 'max:120'],
            'design.footer.blocks.*.placeholder'   => ['nullable', 'string', 'max:80'],
            'design.footer.blocks.*.buttonLabel'   => ['nullable', 'string', 'max:40'],
            'design.footer.blocks.*.links'         => ['nullable', 'array', 'max:10'],
            'design.footer.blocks.*.links.*.label' => ['nullable', 'string', 'max:40'],
            'design.footer.blocks.*.links.*.url'   => $url(),
        ];
    }
}